import { useEffect } from 'react';

/**
 * Appelle `callback` quand on clique en dehors de `ref` ET hors de `buttonRef`.
 */
export default function useOutsideClick(ref, buttonRef, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, buttonRef, callback]);
}
