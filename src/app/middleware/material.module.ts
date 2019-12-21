import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule ,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule
} from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
// import { MatFileUploadModule } from 'angular-material-fileupload';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
// import { MatProgressButtonsModule } from 'mat-progress-buttons';


@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        // MatFileUploadModule,
        MatListModule ,
        MatProgressBarModule,
        // MaterialFileInputModule,
        MatCheckboxModule ,
        MatDatepickerModule ,
        MatNativeDateModule ,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTabsModule,
        MatAutocompleteModule,
        // MatProgressButtonsModule.forRoot()
        MatSelectModule,
        MatFormFieldModule
    ],

    exports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        // MatFileUploadModule,
        MatListModule,
        MatProgressBarModule,
        // MaterialFileInputModule,
        MatCheckboxModule ,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTabsModule,
        MatAutocompleteModule,
        // MatProgressButtonsModule
        MatSelectModule,
        MatFormFieldModule
    ],

})

export class CustomMaterialModule { }
