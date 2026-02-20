import { useCallback } from "react";

const LIST_ROOM_MODAL_ID = "list-room-modal";

/**
 * Returns a stable callback that scrolls the list-room modal's dialog container to top.
 * The actual scroll container is the outer div[role="dialog"], not .modal-body.
 */
export function useScrollListRoomModalToTop() {
  return useCallback(() => {
    if (typeof document === "undefined") return;
    const listRoomModal = document.getElementById(LIST_ROOM_MODAL_ID);
    const dialog = listRoomModal?.closest("[role='dialog']") as HTMLElement | null;
    if (dialog) dialog.scrollTop = 0;
  }, []);
}
