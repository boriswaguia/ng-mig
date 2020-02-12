import {Command, flags} from '@oclif/command'
import { getCurrentDir, dirExist } from '../vendors/helpers/directory.helper'
import { importModulesForFolder } from '../services/modules/dependent-module.service'
import { forkJoin } from 'rxjs'

export default class Dependencies extends Command {
  static description = 'Scan all module files and fix missing modules imports'

  static examples = [
    `$ ng-mig dependencies --project /replace_path/to/your_project`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    project: flags.string({char: 'p', description: 'root project folder containing sources files in the src/ directory.'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const { args, flags } = this.parse(Dependencies);

    const project = flags.project || getCurrentDir();

    if (dirExist(project + "/src")) {
      this.log("----------------------- Started to import modules -------------------");
      importModulesForFolder(project).subscribe(r => {
        r.subscribe(_ => {
          this.log("New file import completed ...");
        })
      });
    } else {
      this.log(
        `This is not a valid project folder. Make sure you have a directory src/ in this folder. ${project}`
      );
    }
  }
}
