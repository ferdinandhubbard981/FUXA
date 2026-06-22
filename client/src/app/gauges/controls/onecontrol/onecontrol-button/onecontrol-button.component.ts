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
    commandValue: number = null;
    feedbackValue: number = null;
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
        this.setFeedbackValue(value);
    }

    setCommandValue(value: number) {
        this.commandValue = value;
        this.refreshValue();
    }

    setFeedbackValue(value: number) {
        this.feedbackValue = value;
        this.refreshValue();
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
        this.commandValue = next;
        this.value = next;
        this.refreshDisplay();
        if (this.onUpdate) {
            this.onUpdate(next.toString());
        }
    }

    private commandIsActive(): boolean {
        // the command tag is considered "null" when it is not a digit or is 0
        return Number.isFinite(this.commandValue) && this.commandValue !== 0;
    }

    private refreshValue() {
        if (this.commandIsActive()) {
            // the displayed digit is only updated by the feedback when it matches the commanded value,
            // otherwise it keeps showing the commanded value
            if (Number.isFinite(this.feedbackValue) && this.feedbackValue === this.commandValue) {
                this.value = this.feedbackValue;
            } else {
                this.value = this.commandValue;
            }
        } else {
            // the command tag is null (not a digit, including 0): the feedback tag's value applies
            this.value = Number.isFinite(this.feedbackValue) ? this.feedbackValue : null;
        }
        this.refreshDisplay();
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
