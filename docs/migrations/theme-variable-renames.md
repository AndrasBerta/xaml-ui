# Migration: control-specific theme variable renames

Applies to branches created **before** the `color_theme_adds` rename commit. If your PR uses
any `--Input*`, `--SubtleButtonForeground`, or `--SliderTrackFillColorDefault` variable, use
the table below.

## Why

The variables introduced earlier on `color_theme_adds` were named ad-hoc. The rest of
[_Theme.scss](../../projects/xaml-ui/src/lib/Theme.scss) follows a strict rule: **every token
is a Microsoft WinUI resource key verbatim, with `Brush` dropped** — WinUI's
`ControlFillColorDefaultBrush` becomes `--ControlFillColorDefault`. The new names broke that,
so a developer who knows WinUI couldn't guess them, and our theme could no longer be diffed
mechanically against `microsoft-ui-xaml` to find parity gaps.

The renames restore the rule. Because we store **colors** where WinUI stores **brushes**,
`Color` takes the place of `Brush` in the name: `TextControlBackground` (a brush) →
`--TextControlBackgroundColor`.

## Rename table

Both forms changed: the internal `--Name` and its public `--XamlUiOverrideName` slot. Replace
whichever your PR touches.

| Old | New | WinUI resource key |
|---|---|---|
| `--InputBorderThickness` | `--TextControlBorderThickness` | `TextControlBorderThemeThickness` |
| `--InputFillColorDefault` | `--TextControlBackgroundColor` | `TextControlBackground` |
| `--InputFillColorSecondary` | `--TextControlBackgroundColorPointerOver` | `TextControlBackgroundPointerOver` |
| `--InputFillColorActive` | `--TextControlBackgroundColorFocused` | `TextControlBackgroundFocused` |
| `--InputFillColorDisabled` | `--TextControlBackgroundColorDisabled` | `TextControlBackgroundDisabled` |
| `--InputStrokeColorDefault` | `--TextControlElevationBorderColor` | `TextControlElevationBorderBrush`, stop @1.0 |
| `--InputStrongStrokeColorDefault` | `--TextControlElevationBorderColorStrong` | `TextControlElevationBorderBrush`, stop @0.5 |
| `--InputStrokeColorActive` | `--TextControlElevationBorderColorFocused` | `TextControlElevationBorderFocusedBrush`, bottom stop |
| `--SliderTrackFillColorDefault` | `--SliderTrackFillColor` | `SliderTrackFill` |
| `--SubtleButtonForeground` | `--AppBarButtonForegroundColor` | `AppBarButtonForeground` |

Unchanged, listed to save you checking: `--ButtonPadding` (already matches WinUI's
`ButtonPadding`) and `--SymbolFontSize` (an xaml-ui extension — WinUI has no equivalent, as
its `FontIcon` inherits `FontSize` from the parent control).

### New tokens, no old equivalent

| New | Default | WinUI resource key |
|---|---|---|
| `--TextControlPadding` | `6px` | `TextControlThemePadding` |
| `--TextControlBorderThicknessFocused` | `2px` (bottom edge only) | `TextControlBorderThemeThicknessFocused` (`1,1,1,2`) |
| `--TextControlElevationBorderColorDisabled` | `var(--ControlStrokeColorDefault)` | `TextControlBorderBrushDisabled` |

`--TextControlElevationBorderColorDisabled` was previously implicit: the disabled TextBox
border reused `--InputStrokeColorDefault`. If your PR restyles disabled inputs, you now have
a dedicated hook.

## Mechanical migration

The renames are unambiguous — no old name is a prefix of another, so plain replacement is
safe. From the repo root:

```bash
git ls-files -z -- '*.scss' '*.css' '*.ts' '*.html' | xargs -0 sed -i \
  -e 's/InputBorderThickness/TextControlBorderThickness/g' \
  -e 's/InputFillColorDefault/TextControlBackgroundColor/g' \
  -e 's/InputFillColorSecondary/TextControlBackgroundColorPointerOver/g' \
  -e 's/InputFillColorActive/TextControlBackgroundColorFocused/g' \
  -e 's/InputFillColorDisabled/TextControlBackgroundColorDisabled/g' \
  -e 's/InputStrokeColorDefault/TextControlElevationBorderColor/g' \
  -e 's/InputStrongStrokeColorDefault/TextControlElevationBorderColorStrong/g' \
  -e 's/InputStrokeColorActive/TextControlElevationBorderColorFocused/g' \
  -e 's/SliderTrackFillColorDefault/SliderTrackFillColor/g' \
  -e 's/SubtleButtonForeground/AppBarButtonForegroundColor/g'
```

Deliberately matching the bare name rather than `--Name`, so the `--XamlUiOverride*` form is
rewritten by the same pass. No old name is a substring of another — `InputStrokeColorDefault`
and `InputStrongStrokeColorDefault` diverge at `Str|Strong` — so rule order does not matter.

Then confirm nothing is left behind:

```bash
grep -rnE 'Input(BorderThickness|FillColor|StrokeColor|StrongStrokeColor)|SubtleButtonForeground|SliderTrackFillColorDefault' \
  --include='*.scss' --include='*.css' --include='*.ts' --include='*.html' .
```

A missed rename does **not** fail the build — an undefined `var()` silently falls back to the
property's initial value (usually transparent or black), so rely on the grep, not on
`ng build`.

## Behavioural changes to expect

Three changes ship alongside the rename. If your PR touches TextBox or its layout, these may
show up in visual diffs:

1. **Light-theme focused TextBox background changed.** The light-mode block previously
   declared `--InputFillColorDefault/Secondary/Disabled` but omitted `--InputFillColorActive`,
   so a focused input in light theme fell through to the *dark* value `#1E1E1EB3`. Derived
   tokens are now declared once outside the media query and resolve per theme correctly, so
   the focused background is `#FFFFFF` as intended. This was a bug fix, not a restyle.
2. **Focused TextBox bottom border thickens** to `--TextControlBorderThicknessFocused` (`2px`),
   matching WinUI.
3. **TextBox is now `box-sizing: border-box`, and its padding is `--TextControlPadding`.** Both
   are required by (2): border-box keeps the outer height fixed, and the focused rule subtracts
   the border's growth from `padding-bottom` so the content box — and the text — stays put.
   WinUI avoids the problem structurally, by animating `BorderThickness` on a separate
   `BorderElement` rather than on the element hosting the text.

## Structural note for future tokens

Derived tokens — control-specific aliases of the base palette — live in one group at the end
of the invariant section in `_Theme.scss`, **not** repeated in the
`@media (prefers-color-scheme: light)` block. An alias whose value is
`var(--ControlFillColorDefault)` already re-resolves per theme, because the base is what the
media query overrides. This mirrors WinUI, whose Light and Dark `ResourceDictionary` entries
point these keys at the *same* base resource; only the base color differs.

Two consequences when adding a derived token:

- Declare it once. Repeating it in the light block is redundant, and omitting one entry from
  that duplicate set is exactly how the bug in (1) above arose.
- Keep it **above** the `@media` rule. Placing custom-property declarations after a nested
  rule triggers Sass's `mixed-decls` deprecation, and in a future Sass version their position
  in the cascade would change.

## Known parity gap

`--TextControlElevationBorderColorFocused` defaults to `var(--AccentFillColorDefault)`, but
WinUI uses `SystemAccentColorLight2`. Dark theme is close; light theme is noticeably darker
than WinUI, since our `--AccentFillColorDefault` is light-mode `#0067C0`
(WinUI's `SystemAccentColorDark1`).

Closing this properly is a separate change: our `--AccentFillColor*` tokens are hardcoded
literals rather than derived, and only `--SystemAccentColor` exists. True parity needs the
full `SystemAccentColorLight1/2/3` + `Dark1/2/3` ladder with `--AccentFillColor*` re-derived
from it — which touches roughly 13 controls (Button, CheckBox, RadioButton, ToggleSwitch,
Slider, ListView, GridView, ListBox, ProgressBar, ProgressRing, PersonPicture, TextBox).
