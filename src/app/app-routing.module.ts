import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './admin/main/main.content.component';
import { CommonModule } from '@angular/common';
import { BankComponent } from './admin/bank/bank.component';
import { SharedModule } from './shared.module';
import { InsertBankComponent } from './admin/bank/insert.bank.component';
import { FormsModule } from '@angular/forms';
import { OstanComponent } from './admin/ostan/ostan.component';
import { InsertOstanComponent } from './admin/ostan/insert.ostan.component';
import { CityComponent } from './admin/city/city.component';
import { InsertCityComponent } from './admin/city/insert.city.component';
import { HttpOstanResolver, HttpEquipmentResolver } from './admin/http.service/http.bank.resolver';
import { DepartmentTypeComponent } from './admin/department.type/dep.type.component';
import { InsertDepTypeComponent } from './admin/department.type/insert.dep.type.component';
import { EquipmentComponent } from './admin/equipment/equipment.component';
import { InsertEquipmentComponent } from './admin/equipment/insert.equipment.component';
import { DepartmentComponent } from './admin/department/dep.component';
import { InsertDepartmentComponent } from './admin/department/insert.dep.component';
import { HttpClientModule } from '@angular/common/http';
import { HighlightDirective } from './service/card.directive';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainContentComponent, },
  { path: 'bank', loadChildren: './admin/bank/bank.component#BankModule' },
  { path: 'department', loadChildren: './admin/department/dep.component#DepartmentModule' },
  { path: 'ostan', loadChildren: './admin/ostan/ostan.component#OstanModule' },
  { path: 'city', loadChildren: './admin/city/city.component#CityModule' },
  { path: 'deptype', loadChildren: './admin/department.type/dep.type.component#DepartmentTypeModule' },
  { path: 'equipment', loadChildren: './admin/equipment/equipment.component#EquipmentModule' },
  { path: 'circletype', loadChildren: './admin/circle.type/circle.type.component#CircleTypeModule' },
  { path: 'posttype', loadChildren: './admin/post.type/post.type.component#PostTypeModule' },
  { path: 'hoze', loadChildren: './admin/hoze/hoze.component#HozeModule' },
  { path: 'branch', loadChildren: './admin/branch/branch.component#BranchModule' },
  { path: 'diagram', loadChildren: './user/diagram/main.diagram.component#DiagramModule' },
  { path: 'filecode', loadChildren: './admin/file.code/file.code.component#FileCodeModule' },
  { path: 'filedefine', loadChildren: './admin/file.define/file.define.component#FileDefineModule' },
  { path: 'branchwork', loadChildren: './user/branch.work/branch.work.component#BranchWorkModule' },
  { path: 'reportbw', loadChildren: './user/report.branch.work/report.branch.work.component#ReportBranchWorkModule' },
  { path: 'search/:branchcode', loadChildren: './user/search.branch/search.branch.component#SearchBranchModule' },
  { path: 'list', loadChildren: './user/parametric.search/branch.list.component#BranchListModule' },
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forRoot(routes)],
  declarations: [MainContentComponent, HighlightDirective],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
