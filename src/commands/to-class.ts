import {Command, flags} from '@oclif/command'
import { getCurrentDir, dirExist } from '../vendors/helpers/directory.helper'
import { convertFolder } from '../services/function-to-class/function-to-class.service'

export default class ToClass extends Command {
  static description = 'Scan all files and refactor exported Controller or Services functions to classes'

  static examples = [
    `$ ng-mig to-class --project /replace_path/to/your_project`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    project: flags.string({char: 'p', description: 'root project folder containing sources files in the src/ directory.'}),
  }

  async run() {
    const { flags } = this.parse(ToClass);

    const project = flags.project || getCurrentDir();

    if (dirExist(project + "/src")) {
      this.log(`----------------------- Started to convert files in ${project} -------------------`);
      convertFolder(project);
    } else {
      this.log(
        `This is not a valid project folder. Make sure you have a directory src/ in this folder. ${project}`
      );
    }
  }
}
