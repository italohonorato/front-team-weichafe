import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Assistance } from 'src/app/interfaces/assistance';
import { Sections } from 'src/app/interfaces/sections';
import { User } from 'src/app/interfaces/user';
import { UserDoc } from 'src/app/models/user/user-doc';
import { AssistanceService } from 'src/app/services/firestore/assistance/assistance.service';
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
    assistanceDate: ['', Validators.required],
    section: [[], Validators.required]
  });
  // Getters assistanceForm
  get assistanceDate() { return this.assistanceForm.get('assistanceDate') }
  get section() { return this.assistanceForm.get('section') }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private utilService: UtilService,
    private sectionsService: SectionsService,
    private assistanceService: AssistanceService) { }

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
        snapshot.sort((a, b) =>
          (a.payload.doc.data()['lastName'] > b.payload.doc.data()['lastName']) ?
            1 : (b.payload.doc.data()['lastName'] > a.payload.doc.data()['lastName']) ?
              -1 : 0);
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
        console.log(`IngresarAsistenciaComponent::getUsersBySection Error -> ${error}`);
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
    return this.utilService.formatRut(run.toString() + dv);
  }

  addAssitance() {
    const numSelected = this.selection.selected.length;
    if (numSelected && numSelected > 0) {
      const selectedStudents = this.selection.selected;
      const list = selectedStudents.map(student => {
        const studentInfo: User = {
          email: student.data.email ? student.data.email : '',
          name: student.data.name,
          lastName: student.data.lastName,
          dob: student.data.dob,
          rut: student.data.rut,
          dv: student.data.dv,
          section: student.data.section
        };

        return studentInfo;
      });

      const assistanceDate = this.assistanceForm.get('assistanceDate').value;
      const sectionSelected = this.assistanceForm.get('section').value;
      let assistance: Assistance = {
        assistance_date: assistanceDate,
        section: sectionSelected,
        user_list: list,
      }

      this.assistanceService.createAssistance(assistance).then(response => {
        Swal.fire('Asistencia Ingresado',
          `Se ha ingresado asistencia para la sección ${sectionSelected} con fecha ${assistanceDate}`,
          'success');
      }).catch(error => {
        console.log(`IngresarAsistenciaComponent::getUsersBySection Error -> ${error}`);
        Swal.fire('Error al ingresar Asistencia', error, 'error');
      });
    } else {
      Swal.fire('Advertencia', 'Debe al menos seleccionar un alumno del listado', 'warning');
    }
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
