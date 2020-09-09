interface ExpandProps {
  element: any;
  height?: number;
  extraHeight?: number;
  extraDynamicHeight?: number;
}

export const expandElement = ({
  element,
  height = 0,
  extraHeight = 0,
  extraDynamicHeight = 0,
}: ExpandProps) => {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;

  // have the element transition to the height of its inner content
  element.style.height = sectionHeight + extraHeight + "px";

  const setInitial = function (e: any) {
    // remove this event listener so it only gets triggered once

    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = null; // `${height + extraDynamicHeight}px`;
  };

  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener("transitionend", setInitial);

  element.removeEventListener("transitionend", setInitial);

  // mark the section as "currently not collapsed"
  element.setAttribute("data-collapsed", "false");
};

interface CollapseProps {
  element: any;
  height?: number;
  extraDynamicHeight?: number;
}

export const collapseElement = ({
  element,
  height = 0,
  extraDynamicHeight = 0,
}: CollapseProps) => {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;

  // temporarily disable all css transitions
  var elementTransition = element.style.transition;
  element.style.transition = "";

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function () {
    element.style.height = `${sectionHeight}px`;
    element.style.transition = elementTransition;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function () {
      element.style.height = `${height + extraDynamicHeight}px`; //0 + 'px'
    });
  });

  // mark the section as "currently collapsed"
  element.setAttribute("data-collapsed", "true");
};

export const updateHeight = (
  element: any,
  height: number,
  extraDynamicHeight = 0,
) => {
  requestAnimationFrame(function () {
    element.style.height = `${height + extraDynamicHeight}px`; //0 + 'px'
  });
};
