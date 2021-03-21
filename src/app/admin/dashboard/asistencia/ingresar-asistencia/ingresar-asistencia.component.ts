import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Sections } from 'src/app/interfaces/sections';
import { User } from 'src/app/interfaces/user';
import { UserDoc } from 'src/app/models/user/user-doc';
import { SectionsService } from 'src/app/services/firestore/sections/sections.service';
import { UsersService } from 'src/app/services/firestore/users/users.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-asistencia',
  templateUrl: './ingresar-asistencia.component.html',
  styleUrls: ['./ingresar-asistencia.component.css']
})
export class IngresarAsistenciaComponent implements OnInit {

  getAllUsersSubscription: Subscription;
  usersList: User[];
  userDocList: UserDoc[];
  sections: Sections[] = new Array<Sections>();
  displayedColumns: string[] = ['select', 'position', 'name', 'lastName', 'run', 'email', 'dob', 'section'];
  dataSource;
  selectedUser: UserDoc;
  selection = new SelectionModel<UserDoc>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Form
  assistanceForm = this.formBuilder.group({
    assitanceDate: ['', Validators.required],
    section: [[], Validators.required]
  });
  // Getters assistanceForm
  get assitanceDate() { return this.assistanceForm.get('assitanceDate') }
  get section() { return this.assistanceForm.get('section') }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private uitlService: UtilService,
    private sectionsService: SectionsService) { }

  ngOnDestroy(): void {
    console.log('Ejecuntando ngOnDestroy...');
  }

  ngOnInit() {
    this.getAllSections();
  }

  getAllSections() {
    this.sectionsService.getAllSections().subscribe(snapshot => {
      this.sections = snapshot.map(data => {
        let unknownObj = data.payload.doc.data();
        let section = {
          name: unknownObj['name']
        }
        return section;
      });
    })
  }

  getUsersBySection() {
    const sectionSelected = this.assistanceForm.get('section').value;
    this.getAllUsersSubscription = this.userService.getUsersBySection(sectionSelected).subscribe(
      snapshot => {
        let rowCount = 0;
        this.userDocList = snapshot.map(userData => {
          let userDoc: UserDoc = new UserDoc();
          userDoc.position = ++rowCount;
          userDoc.id = userData.payload.doc.id;
          userDoc.data = this.extractUserData(userData.payload.doc.data());
          return userDoc;
        });
        this.dataSource = new MatTableDataSource<UserDoc>(this.userDocList);
        this.dataSource.paginator = this.paginator;
      }, error => {
        console.log(`ListUsersComponent::getAllUsers Error -> ${error}`);
        Swal.fire('Error al consultar Usuarios', error, 'error');
      }
    );
  }

  extractUserData(data: unknown): User {
    const user: User = {
      uid: data['uid'],
      name: data['name'],
      lastName: data['lastName'],
      email: data['email'],
      rut: data['rut'],
      dv: data['dv'],
      dob: data['dob'] ? data['dob'] : undefined,
      section: data['section']
    };

    return user;
  }

  formatRut(run: number, dv: string) {
    return this.uitlService.formatRut(run.toString() + dv);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserDoc): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
