
import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { User } from 'src/app/chat/model/user.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: '[mon-attribut="app-dialog"]',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatSelectModule,MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,CommonModule],

})
export class DialogOverviewExampleDialog {
  selectedUser: any; // Propriété pour stocker l'utilisateur sélectionné

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public amis: User[],
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(): void {
    if (this.selectedUser) {
      console.log('Selected User:', this.selectedUser);
      this.dialogRef.close('this.selectedUser');
    }
    this.dialogRef.close();
  }
}
