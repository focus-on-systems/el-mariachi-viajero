import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: InputComponent,
  }],
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @Input()
  public type: string = 'text';

  @Input()
  public name: string = 'input';

  @Input()
  public placeholder: string = '';

  @Input()
  public label: string = '';

  @Input()
  public required: boolean = false;

  @Input()
  public textColor: 'white' | 'black' = 'black';

  @Input()
  public isTextArea: boolean = false;

  @ViewChild('inputEl')
  // @ts-ignore
  public inputEl: ElementRef;

  @ViewChild('textAreaEl')
  // @ts-ignore
  public textAreaEl: ElementRef;
  private _value: string = '';

  private _touched: boolean = false;
  private _onChange = (value: string) => {
  };
  private _onTouched = () => {
  };

  constructor() {
  }

  ngAfterViewInit() {
    this.writeValue(this._value);
  }

  writeValue(obj: string): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public onBlur(): void {
    if (!this._touched) {
      this._onTouched();
      this._touched = true;
    }
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this._onChange(value);
  }
}
