document.documentElement.style.height = '99%';

body = document.body;
body.style.margin = '0px';
body.style.minHeight = '100%';

// e.g. attr(rect, {stroke_width: 5, stroke: 'red'})
//      attr(rect, 'stroke', 'red')
attr = (elem, key_or_dict, val_or_nothing) => {
  if (typeof(key_or_dict) === 'string') {
    let key = key_or_dict;
    let val = val_or_nothing;
    let old = elem.getAttribute(key);
    if (val !== undefined) elem.setAttribute(key, val);
    return old;
  } else {
    let dict = key_or_dict;
    for (let [k,v] of Object.entries(dict)) {
      let value = v;
      elem.setAttribute(k.replace('_','-'), value);
    }
  }
}

// e.g. rect = svgel('rect', svg, {x: 5, y: 5, width: 5, height: 5})
svgel = (tag, parent, attrs) => {
  let elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (attrs !== undefined) attr(elem, attrs);
  if (parent !== undefined)
    parent.appendChild(elem);
  return elem;
};

svg = svgel('svg', body);
svg.style.border = '2px dashed red';

resize = () => {
  let dims = {width: body.offsetWidth*0.99, height: body.offsetHeight*0.99};
  attr(svg, dims);
};

window.onresize = resize;

resize();

svg.onmousedown = e => {
  let {offsetX, offsetY} = e
  point([offsetX, offsetY]);
};

body.onkeydown = e => {
  let { key } = e;
  if (key === 'l') {
    line()
  }
};

dom = {};

dom.lines  = svgel('g', svg, { id: "lines" });
dom.points = svgel('g', svg, { id: "points" });

points = [];
point = ([x, y]) => {
  svgel('circle', dom.points, {cx: x, cy: y, r: 10, fill: 'red'});
  points.push([x,y]);
};

line = () => {
  if (points.length >= 2) {
    let [x1, y1] = points.pop();
    let [x2, y2] = points.pop();
    svgel('line', dom.lines, { x1: x1, x2: x2, y1: y1, y2: y2, stroke: 'black' });
  }
};
