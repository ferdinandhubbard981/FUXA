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
    // the value last commanded through the +/- buttons, awaiting confirmation from the feedback tag.
    // null means there is no pending command and the feedback tag drives the displayed digit.
    pendingCommand: number = null;
    feedbackValue: number = null;
    displayValue = '';
    isReadonly = false;
    disabled = false;
    onUpdate: (value: string) => void;

    static readonly MISMATCH_BACKGROUND = '#B7950B';

    get valueBackgroundColor(): string {
        return this.feedbackMatchesCommand() ? this.options.valueBackground : OneControlButtonComponent.MISMATCH_BACKGROUND;
    }

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

    setFeedbackValue(value: number) {
        this.feedbackValue = value;
        if (this.pendingCommand !== null) {
            // while a command is pending the digit only follows the feedback once it matches the
            // commanded value (including 0); non-matching/stale feedback is ignored to avoid rubber-banding
            if (Number.isFinite(value) && value === this.pendingCommand) {
                this.pendingCommand = null;
                this.value = value;
            }
        } else {
            // no pending command: the feedback tag's value applies
            this.value = Number.isFinite(value) ? value : null;
        }
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
        // if the commanded value already equals the current feedback there is nothing to wait for
        this.pendingCommand = (Number.isFinite(this.feedbackValue) && next === this.feedbackValue) ? null : next;
        this.value = next;
        this.refreshDisplay();
        if (this.onUpdate) {
            this.onUpdate(next.toString());
        }
    }

    private feedbackMatchesCommand(): boolean {
        if (this.pendingCommand === null) {
            // no pending command: the digit is in sync with the feedback
            return true;
        }
        return Number.isFinite(this.feedbackValue) && this.feedbackValue === this.pendingCommand;
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
