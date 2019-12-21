import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { NgModule } from '@angular/core';
import {BlockUIModule} from 'primeng/blockui';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {FileUploadModule} from 'primeng/fileupload';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {PickListModule} from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ProgressBarModule} from 'primeng/progressbar';

@NgModule({
    imports: [ProgressSpinnerModule,
        BlockUIModule,
        DropdownModule,
        InputTextModule,
        CalendarModule,
        FileUploadModule,
        TableModule,
        PaginatorModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        PickListModule,
        DialogModule,
        SplitButtonModule,
        ProgressBarModule],
    exports: [
        ProgressSpinnerModule,
        BlockUIModule,
        DropdownModule,
        InputTextModule,
        CalendarModule,
        FileUploadModule,
        TableModule,
        PaginatorModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        PickListModule,
        DialogModule,
        SplitButtonModule,
        ProgressBarModule]
})

export class CustomPrimeNGModule {}
