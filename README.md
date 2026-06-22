# Special Right Triangles on the Unit Circle

An interactive web applet for deriving exact trigonometric values from special
right triangles. MathJax renders the point-coordinate expression from LaTeX.

The prototype lets a student:

- use one large dynamic reference triangle with no preliminary docking step;
- drag its endpoint continuously around the circumference;
- see decimal approximations between special angles and exact radical values
  when the point snaps to a special angle;
- snap to 0°, 90°, 180°, and 270° with exact axis values;
- render radicals consistently from LaTeX with a full vinculum and stacked fractions;
- pre-render exact point coordinates so snap-point labels update immediately;
- reach every quadrantal, 30°, 45°, and 60° special angle in one pass;
- switch the circle and jump controls between degree and radian labels;
- preserve clockwise direction as negative degree and radian angle measures;
- track the quadrant and reference angle during exploration;
- see the reference angle as a highlighted arc to the nearest x-axis;
- connect signed leg lengths to `(cos θ, sin θ)`; and
- restart the construction with the side-mounted reset control.

## Run locally

From this directory:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

No build step or package installation is required. An internet connection is
needed to load MathJax from its CDN.

## Related

Visit [dydxmath.com](https://dydxmath.com/) for more mathematics resources.

## Likely next iteration

Add an optional exact-versus-decimal comparison mode.
