# Special Right Triangles on the Unit Circle

An interactive, dependency-free web applet for deriving exact trigonometric
values from special right triangles.

The prototype lets a student:

- use one large dynamic reference triangle with no preliminary docking step;
- drag its endpoint continuously around the circumference;
- see decimal approximations between special angles and exact radical values
  when the point snaps to a special angle;
- snap to 0°, 90°, 180°, and 270° with exact axis values;
- display radicals with a full vinculum and fractions in stacked form;
- reach every quadrantal, 30°, 45°, and 60° special angle in one pass;
- switch the circle and jump controls between degree and radian labels;
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

No build step or package installation is required.

## Related

Visit [dydxmath.com](https://dydxmath.com/) for more mathematics resources.

## Likely next iteration

Add an optional exact-versus-decimal comparison mode.
