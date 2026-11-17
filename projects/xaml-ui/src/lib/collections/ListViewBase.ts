import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { SelectorComponent } from "../primitives/Selector";

export type ListViewSelectionMode = 'None' | 'Single';

@Component({
  selector: 'ListViewBase',
  template: '',
})
export abstract class ListViewBaseComponent extends SelectorComponent {

  //Selection mode
  private _selectionMode: ListViewSelectionMode = 'Single';
  get SelectionMode() {
    return this._selectionMode;
  }
  @Input() set SelectionMode(value: ListViewSelectionMode) {
    if (value === this._selectionMode) return;

    this._selectionMode = value;
    if (!this.isSelectionEnabled) this.SelectedIndex = -1;
  }

  //Item click, raised only when enabled, as in WinUI
  @Input() IsItemClickEnabled: boolean = false;
  @Output() ItemClick = new EventEmitter<number>();

  protected override get isSelectionEnabled() {
    return this.SelectionMode !== 'None';
  }

  protected override onItemClick(event: Event, index: number, item: any) {
    if (!this.IsEnabled) return;

    super.onItemClick(event, index, item);

    if (this.IsItemClickEnabled) {
      this.ItemClick.emit(index);
    }
  }

  //Items of a disabled list, or ones which can be neither selected nor clicked get no hover and pressed feedback
  @HostBinding('class.interactive')
  protected get isInteractive() {
    return this.IsEnabled && (this.isSelectionEnabled || this.IsItemClickEnabled);
  }
}
