import { Component, HostBinding, Input } from "@angular/core";
import { Orientation } from "../Common";
import { PanelComponent } from "./Panel";

@Component({
  selector: 'WrapPanel',
  template: `<ng-content/>`,
  styles: `:host {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    align-content: flex-start;
  }`
})
export class WrapPanelComponent extends PanelComponent {
  @Input() Orientation: Orientation = 'Horizontal';
  @Input() @HostBinding('style.column-gap') HorizontalSpacing?: string;
  @Input() @HostBinding('style.row-gap') VerticalSpacing?: string;

  @HostBinding('style.flex-direction')
  private get flexDirection() {
    return this.Orientation === 'Horizontal' ? 'row' : 'column';
  }
}
