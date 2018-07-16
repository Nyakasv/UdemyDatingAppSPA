import { MemberEditComponent } from './../members/member-edit/member-edit.component';
import { Injectable, Component } from '@angular/core';
import { CanDeactivate } from '../../../node_modules/@angular/router';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate <MemberEditComponent> {
    canDeactivate(component: MemberEditComponent) {
        if (component.editform.dirty) {
            return confirm('If you continue all unsaved changes will be lost');
        }
        return true;
    }
}
