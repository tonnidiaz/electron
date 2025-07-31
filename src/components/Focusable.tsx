import { HTMLAttributes, useEffect, useRef } from "react";

const TuFocusable = (props: HTMLAttributes<HTMLDivElement>) => {
    const ref = useRef<HTMLDivElement>(null);
    
    function onKeydown(e) {
        const el = ref.current;
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
          e.preventDefault();
          const range = document.createRange();
          range.selectNodeContents(el);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

    useEffect(()=>{
        const el = ref.current;
        if (!el) return;

        el.addEventListener('keydown', onKeydown);
    }, [ref.current])
    
    return ( <div  tabIndex={0} role="region" ref={ref} {...props}></div> );
}
 
export default TuFocusable;