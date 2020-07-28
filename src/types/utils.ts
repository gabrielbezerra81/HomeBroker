export function typedAssign(target: any, source: any, typecheck = true) {
    const temp: { [k: string]: any } = {};
    for (const key of Object.keys(source)) {
      if (typecheck) {
        const sameType = typeof source[key] === typeof target[key];
        if (sameType && source[key]) temp[key] = source[key];
      } //
      else if (source[key]) temp[key] = source[key];
    }
  
    Object.assign(target, temp);
  }