import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {ListTreeItemComponent, ResumeItemComponent, ResumeListComponent, ToolbarComponent} from './components';
import {CurrencyPipe} from './pipes';

@NgModule({
  declarations: [
    // Components
    ListTreeItemComponent,
    ResumeItemComponent,
    ResumeListComponent,
    ToolbarComponent,
    // Pipes
    CurrencyPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    // Material
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    // Cdk
    ClipboardModule,
    DragDropModule,
    // Flex
    FlexLayoutModule,
    // Material
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTreeModule,
    MatToolbarModule,
    // Components
    ListTreeItemComponent,
    ResumeItemComponent,
    ResumeListComponent,
    ToolbarComponent,
    // Pipes
    CurrencyPipe
  ]
})
export class SharedModule {}
