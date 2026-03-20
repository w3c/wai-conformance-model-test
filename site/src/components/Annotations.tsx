import { Signal, signal, useSignal } from "@preact/signals";
import type { CollectionEntry } from "astro:content";
import { useLayoutEffect } from "preact/hooks";

interface Annotation {
  breakEntry: CollectionEntry<"breaks">;
  element: HTMLElement;
}

const annotations: Signal<Annotation[]> = signal([]);

// TODO: remove if we're sure about not going sidebar route
// function measureAnnotationPositions() {
//   return annotations.value.map(({ element }) => element.offsetTop);
// }

export type OffsetDirection = "left" | "right";

interface AnnotationRegistrationProps {
  // TODO: potentially allow multiple (but still to be rendered separately)
  breakEntry: CollectionEntry<"breaks">;
  offset?: OffsetDirection;
}

export const AnnotationLink = ({
  breakEntry,
  offset,
}: AnnotationRegistrationProps) => {
  const listPosition = useSignal(0);
  const classes = [
    "annotation-link",
    ...(offset ? [`offset-${offset}`] : []),
  ];

  useLayoutEffect(() => {
    // TODO: update w/ final data attribute value format
    const element = document.querySelector(
      `[data-annotation="${breakEntry.data.title}"]`
    ) as HTMLElement | null;
    if (!element)
      throw new Error(`Couldn't resolve element from ${breakEntry.data.title}`);

    const newValue = [
      ...annotations.value,
      {
        breakEntry,
        element,
      },
    ];
    annotations.value = newValue;
    listPosition.value = newValue.length;
  }, []);

  return (
    <a class={classes.join(" ")} href={`#annotation-${listPosition.value}`}>
      {listPosition.value}
    </a>
  );
};

// export const AnnotationSidebar = () => {
//   const positions = useSignal<number[]>([]);
//   const updatePositions = useCallback(() => {
//     positions.value = measureAnnotationPositions();
//   }, []);

//   useLayoutEffect(() => {
//     updatePositions();
//     window.addEventListener("resize", updatePositions);
//     return () => {
//       window.removeEventListener("resize", updatePositions);
//     };
//   }, []);

//   return (
//     <div class="annotation-bar">
//       {annotations.value.map(({ element }, i) => (
//         <a
//           class="annotation-link"
//           data-annotation-target={element.id}
//           href={`#annotation${i + 1}`}
//           style={{ top: positions.value[i] + "px" }}
//         >
//           {i + 1}
//         </a>
//       ))}
//     </div>
//   );
// };

export const AnnotationList = () => (
  <div class="annotation-list">
    <h2>Annotations</h2>
    {annotations.value.map(({ breakEntry: { data }, element }, i) => {
      const title = data[import.meta.env.PUBLIC_FIXED ? "fixTitle" : "title"];
      const description =
        data[import.meta.env.PUBLIC_FIXED ? "fixDescription" : "description"];

      return (
        <div id={`annotation-${i + 1}`} class="annotation-list-item">
          {title && <h3>{title}</h3>}
          {/* TODO: render description as markdown (reuse Astro's toolchain) */}
          {description}
          <dl>
            {data.wcag2 && (
              <>
                <p>This fails the following WCAG 2 success criteria:</p>
                <ul>
                  {data.wcag2.map((sc) => (
                    <li>{sc}</li>
                  ))}
                </ul>
              </>
            )}
            {data.wcag3 && (
              <>
                <p>This fails the following WCAG 3 provisions:</p>
                <ul>
                  {data.wcag3.map((provision) => (
                    <li>{provision}</li>
                  ))}
                </ul>
              </>
            )}
          </dl>
          <p>
            <a href={`#${element.id}`}>Return to location in page</a>
          </p>
        </div>
      );
    })}
  </div>
);
