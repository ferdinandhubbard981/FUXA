/* eslint-disable @angular-eslint/component-selector */
import { Component, ElementRef, ViewChild } from '@angular/core';

export class OneControlOptions {
    label = 'RWY CTL';
    step = 1;
    feedbackVariableId: string = null;
    background = '#292929';
    buttonBackground = '#292929';
    valueBackground = '#405F3D';
    labelColor = '#B5B4B4';
    buttonColor = '#B5B4B4';
    valueColor = '#FFFFFF';
    decimals = 0;
    fontSize = 13;
}

@Component({
    selector: 'app-onecontrol-button',
    templateUrl: './onecontrol-button.component.html',
    styleUrls: ['./onecontrol-button.component.scss']
})
export class OneControlButtonComponent {

    @ViewChild('valueText', { static: false }) public valueText: ElementRef;

    options: OneControlOptions = new OneControlOptions();
    value: number = null;
    displayValue = '';
    isReadonly = false;
    disabled = false;
    onUpdate: (value: string) => void;

    setOptions(options: OneControlOptions) {
        if (options) {
            this.options = { ...new OneControlOptions(), ...options };
        }
        this.refreshDisplay();
    }

    setLabel(label: string) {
        if (label !== null && label !== undefined) {
            this.options.label = label;
        }
    }

    setValue(value: number) {
        this.value = value;
        this.refreshDisplay();
    }

    setDisabled(state: boolean) {
        this.disabled = state;
    }

    bindUpdate(callback: (value: string) => void) {
        this.onUpdate = callback;
    }

    onDecrement() {
        this.applyStep(-Math.abs(this.options.step || 1));
    }

    onIncrement() {
        this.applyStep(Math.abs(this.options.step || 1));
    }

    private applyStep(delta: number) {
        if (this.isReadonly || this.disabled) {
            return;
        }
        const current = Number.isFinite(this.value) ? this.value : 0;
        const next = current + delta;
        this.value = next;
        this.refreshDisplay();
        if (this.onUpdate) {
            this.onUpdate(next.toString());
        }
    }

    private refreshDisplay() {
        if (this.value === null || this.value === undefined || Number.isNaN(this.value)) {
            this.displayValue = '';
        } else {
            const decimals = this.options.decimals ?? 0;
            this.displayValue = Number(this.value).toFixed(decimals);
        }
    }
}
