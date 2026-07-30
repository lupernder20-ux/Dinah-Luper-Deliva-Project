// Stub for the visual design-mode toolbar (click-to-edit Tailwind classes)
// that normally lives one directory above `apps/` on the hosted Anything.com
// platform. Not part of this standalone repo, so this no-op keeps the app
// buildable/runnable on its own (e.g. on Render).
export type GetStyleInfo = (resolved: { element: unknown }) => {
  className: string;
  styles: Record<string, string> | null;
};

export function initDesignMode(_getStyleInfo: GetStyleInfo): () => void {
  return () => {};
}
