import {Command, flags} from '@oclif/command'
import { getCurrentDir, dirExist } from '../vendors/helpers/directory.helper'
import { importModulesForFolder } from '../services/dependencies/dependent-module.service'
import { annotateFolder } from '../services/annotate/annotate.service'

export default class Annotate extends Command {
  static description = 'Scan all module files and refactor annotation services'

  static examples = [
    `$ ng-mig annotate --project /replace_path/to/your_project`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    project: flags.string({char: 'p', description: 'root project folder containing sources files in the src/ directory.'}),
  }

  async run() {
    const { flags } = this.parse(Annotate);

    const project = flags.project || getCurrentDir();

    if (dirExist(project + "/src")) {
      this.log(`----------------------- Started to annotate modules in ${project} -------------------`);
      annotateFolder(project);
    } else {
      this.log(
        `This is not a valid project folder. Make sure you have a directory src/ in this folder. ${project}`
      );
    }
  }
}
