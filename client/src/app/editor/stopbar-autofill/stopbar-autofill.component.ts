import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA as MAT_DIALOG_DATA, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import { Device, Tag } from '../../_models/device';

export interface StopbarAutofillData {
    devices: Device[];
}

export interface StopbarAutofillResult {
    offColour: string;
    onColour: string;
    hideShowTagId: string;
}

interface TagOption {
    id: string;
    label: string;
}

@Component({
    selector: 'app-stopbar-autofill',
    templateUrl: './stopbar-autofill.component.html',
    styleUrls: ['./stopbar-autofill.component.scss']
})
export class StopbarAutofillComponent {

    offColour = '#FF0000';
    onColour = '#00FF00';
    hideShowTagId = '';
    tagOptions: TagOption[] = [];

    constructor(
        public dialogRef: MatDialogRef<StopbarAutofillComponent>,
        @Inject(MAT_DIALOG_DATA) public data: StopbarAutofillData
    ) {
        if (data?.devices) {
            for (const device of data.devices) {
                if (device.tags) {
                    for (const tag of Object.values(device.tags) as Tag[]) {
                        this.tagOptions.push({
                            id: tag.id,
                            label: `${device.name} / ${tag.name}`
                        });
                    }
                }
            }
            this.tagOptions.sort((a, b) => a.label.localeCompare(b.label));
        }
    }

    onApply(): void {
        this.dialogRef.close(<StopbarAutofillResult>{
            offColour: this.offColour,
            onColour: this.onColour,
            hideShowTagId: this.hideShowTagId
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
