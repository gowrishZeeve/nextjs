export const prefixPath = (src: string): string => {
  if (
    process.env.NEXT_PUBLIC_SUB_PATH !== "" &&
    process.env.NEXT_PUBLIC_SUB_PATH !== undefined
  ) {
    return process.env.NEXT_PUBLIC_SUB_PATH + src;
  }
  return src;
};


export const removeHighlight = (x: any, type: 'border'|'heading') => {
  const t = x;
  if (t) {
    if (type === 'border') t.current.style.borderColor = '#ced4da';
    else t.current.style.color = 'black';
  }
};

export const highlight = (x: any, type: 'border'|'heading') => {
  const t = x;
  if (t) {
    if (type === 'border') t.current.style.borderColor = 'red';
    else t.current.style.color = 'red';
  }
};
