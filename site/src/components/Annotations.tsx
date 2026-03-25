import { Signal, signal, useSignal } from "@preact/signals";
import type { CollectionEntry } from "astro:content";
import { useLayoutEffect, useRef } from "preact/hooks";

import wcag2 from "@/lib/wcag2.json";

const annotations: Signal<CollectionEntry<"breaks">[]> = signal([]);

/**
 * Displays the annotation dialog with the content for the given annotation.
 */
function showAnnotation(id: number) {
  const dialogEl = document.getElementById(
    "annotation-dialog"
  ) as HTMLDialogElement;
  const dialogBodyEl = document.getElementById(
    "annotation-dialog-body"
  ) as HTMLElement;
  dialogBodyEl.innerHTML = "";
  const annotationEl = document.getElementById(`annotation-${id}`);
  if (!annotationEl) throw new Error(`Invalid annotation ID specified: ${id}`);
  for (const child of annotationEl.childNodes) {
    if (child instanceof HTMLElement) {
      if (child.tagName === "H3") {
        // Set h2 content for dialog "title"
        dialogEl.querySelector("h2")!.innerHTML = child.innerHTML;
        continue;
      }
      if (child.matches("p:last-child:has(a:only-child)")) {
        // Skip "Jump to location in page" link paragraph
        continue;
      }
    }
    dialogBodyEl.appendChild(child.cloneNode(true));
  }

  dialogEl.showModal();
}

function closeAnnotation() {
  (document.getElementById("annotation-dialog") as HTMLDialogElement).close();
}

export type OffsetDirection = "left" | "right";

interface AnnotationButtonProps {
  // TODO: potentially allow multiple (but still to be rendered separately)
  breakEntry: CollectionEntry<"breaks">;
  offset?: OffsetDirection;
}

export const AnnotationButton = ({
  breakEntry,
  offset,
}: AnnotationButtonProps) => {
  const listPosition = useSignal(-1);
  const ref = useRef<HTMLButtonElement | null>(null);
  const classes = [
    "annotation-button",
    ...(offset ? [`offset-${offset}`] : []),
  ];

  useLayoutEffect(() => {
    if (!ref.current)
      throw new Error(`Couldn't resolve AnnotationButton element`);

    const newValue = [...annotations.value, breakEntry];
    annotations.value = newValue;
    listPosition.value = newValue.length;
  }, []);

  return (
    <button
      class={classes.join(" ")}
      type="button"
      onClick={() => showAnnotation(listPosition.value)}
      id={`annotation-button-${listPosition.value}`}
      ref={ref}
    >
      {listPosition.value}
    </button>
  );
};

export const AnnotationList = () => (
  <>
    <div class="annotation-list">
      <h2>Annotations</h2>
      {annotations.value.map(({ data }, i) => {
        const title = data[import.meta.env.PUBLIC_FIXED ? "fixTitle" : "title"];
        const description =
          data[import.meta.env.PUBLIC_FIXED ? "fixDescription" : "description"];

        return (
          <div id={`annotation-${i + 1}`} class="annotation-list-item">
            {title && <h3>{title}</h3>}
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <dl>
              {data.wcag2 && (
                <>
                  <p>
                    This satisfies the following WCAG 2 success
                    {` criteri${data.wcag2.length === 1 ? "on" : "a"}`}:
                  </p>
                  <ul>
                    {data.wcag2.map((sc) => (
                      <li>
                        {sc} {wcag2[sc]}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {data.wcag3 && (
                <>
                  <p>
                    This satisfies the following WCAG 3
                    {` provision${data.wcag3.length === 1 ? "" : "s"}`}:
                  </p>
                  <ul>
                    {data.wcag3.map((provision) => (
                      <li>{provision}</li>
                    ))}
                  </ul>
                </>
              )}
            </dl>
            <p>
              <a href={`#annotation-button-${i + 1}`}>
                Jump to location in page
              </a>
            </p>
          </div>
        );
      })}
    </div>
    <dialog id="annotation-dialog">
      <button onClick={closeAnnotation}>Close</button>
      <h2></h2>
      <div id="annotation-dialog-body"></div>
    </dialog>
  </>
);
