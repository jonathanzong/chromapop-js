chromapop-js
============

Javascript implementation of ChromaPop.

# Color Space

ChromaPop operates based on the [RGB color model](http://en.wikipedia.org/wiki/RGB_color_model).

_Red_, _Green_, and _Blue_ are considered *primary* colors.

_Cyan_, _Magenta_, and _Yellow_ are considered *secondary* colors.

_White_ is the sum of all three primary colors, or a *tertiary* color.

# Scoring

Clicking on part of a block of _3 or more continuously adjacent bubbles_ will result in a valid move.

- Clicking on a primary color will pop a block of that color, awarding _1 point_ for each bubble.
- Clicking on a non-primary will do one of the following:
- - If there is a valid block of that non-primary color, it will pop.
- - - A *2x multiplier* is awarded for secondary colors (CMY).
- - - A *3x multiplier* is awarded for the tertiary color (w).
- - If there are not at least 3 continuously adjacent bubbles of that same color, the bubble will _decompose into its primary components_.
- - - A blocks of continuously adjacent bubbles to the original bubble of the same color as a primary component of that bubble will be popped.
- - - For example: Clicking a *Magenta* bubble will pop a range of *Red* and *Blue* bubbles. The original bubble will be left as a primary bubble.
