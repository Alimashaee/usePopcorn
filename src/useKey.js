import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(
    function () {
      function keydownEventHandler(e) {
        if (e.code === key) {
          callback();
        }
      }

      document.addEventListener("keydown", keydownEventHandler);
      return function () {
        document.removeEventListener("keydown", keydownEventHandler);
      };
    },
    [callback]
  );
}
