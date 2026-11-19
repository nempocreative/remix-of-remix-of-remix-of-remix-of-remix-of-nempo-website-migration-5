import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NempoOrganizerVideo } from "./nempo-organizer-video";

describe("carousel video playback", () => {
  let intersect: (visible: boolean) => void;
  let play: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = (visible) => callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      disconnect() {}
    });
    play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  const props = { src: "/welcome.mp4", poster: "/poster.webp", controls: false, soundOnInteraction: true };

  it("restarts at zero and plays on each return even after visibility changes", () => {
    const { container, rerender } = render(<NempoOrganizerVideo {...props} />);
    act(() => intersect(true));
    const video = container.querySelector("video");
    if (!video) throw new Error("Missing video");
    video.currentTime = 5;
    rerender(<NempoOrganizerVideo {...props} active={false} />);
    expect(video.currentTime).toBe(0);
    act(() => intersect(false));
    play.mockClear();
    rerender(<NempoOrganizerVideo {...props} active />);
    expect(play).not.toHaveBeenCalled();
    act(() => intersect(true));
    expect(play).toHaveBeenCalled();
    video.currentTime = 3;
    rerender(<NempoOrganizerVideo {...props} active={false} />);
    play.mockClear();
    rerender(<NempoOrganizerVideo {...props} active />);
    expect(play).toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
  });

  it("unmutes after a gesture and retains sound when the slide returns", () => {
    const { container, rerender } = render(<NempoOrganizerVideo {...props} />);
    act(() => intersect(true));
    const video = container.querySelector("video");
    if (!video) throw new Error("Missing video");
    expect(video.muted).toBe(true);
    fireEvent.pointerDown(document);
    expect(video.muted).toBe(false);
    rerender(<NempoOrganizerVideo {...props} active={false} />);
    rerender(<NempoOrganizerVideo {...props} active />);
    expect(video.muted).toBe(false);
  });

  it("autoplays on screen, pauses offscreen and resumes on return by default", () => {
    const { container } = render(<NempoOrganizerVideo src="/welcome.mp4" poster="/poster.webp" />);
    const video = container.querySelector("video");
    if (!video) throw new Error("Missing video");
    expect(play).not.toHaveBeenCalled();
    act(() => intersect(true));
    expect(play).toHaveBeenCalled();
    fireEvent.pointerDown(document);
    expect(video.muted).toBe(false);
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    pause.mockClear();
    act(() => intersect(false));
    expect(pause).toHaveBeenCalled();
    expect(video.autoplay).toBe(false);
    play.mockClear();
    fireEvent.pointerDown(document);
    expect(play).not.toHaveBeenCalled();
    act(() => intersect(true));
    expect(play).toHaveBeenCalled();
  });

  it("does not restart offscreen when a pending sound play is rejected", async () => {
    let rejectPlay: (reason?: unknown) => void = () => {};
    play.mockImplementationOnce(() => new Promise<void>((_, reject) => { rejectPlay = reject; }));
    render(<NempoOrganizerVideo src="/welcome.mp4" poster="/poster.webp" />);
    act(() => intersect(true));
    act(() => intersect(false));
    play.mockClear();
    await act(async () => { rejectPlay(new Error("Playback denied")); });
    expect(play).not.toHaveBeenCalled();
  });

  it("shows NEMPO services instead of a blank frame when the video fails to open", () => {
    const { container, getByText } = render(<NempoOrganizerVideo {...props} />);
    act(() => intersect(true));
    const video = container.querySelector("video");
    if (!video) throw new Error("Missing video");
    fireEvent.error(video);
    expect(getByText("Wedding Organizer")).toBeTruthy();
    expect(getByText("Event Organizer")).toBeTruthy();
    expect(getByText("Ketuk untuk memutar video lagi")).toBeTruthy();
  });

  it("shows the services fallback when a visible video has not started after 12 seconds", () => {
    vi.useFakeTimers();
    try {
      const { queryByText } = render(<NempoOrganizerVideo {...props} />);
      act(() => intersect(true));
      act(() => { vi.advanceTimersByTime(11000); });
      expect(queryByText("Wedding Organizer")).toBeNull();
      act(() => { vi.advanceTimersByTime(1500); });
      expect(queryByText("Wedding Organizer")).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("waits for a tap when the device asks for reduced motion, then plays", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} }));
    const { getByRole } = render(<NempoOrganizerVideo src="/welcome.mp4" poster="/poster.webp" label="Animasi teteh" />);
    act(() => intersect(true));
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(getByRole("button", { name: /Ketuk untuk memutar video/ }));
    expect(play).toHaveBeenCalled();
  });
});
