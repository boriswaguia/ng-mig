import {Command, flags} from '@oclif/command'
import { getCurrentDir, dirExist } from '../vendors/helpers/directory.helper'
import { parseToTypescriptFolder } from '../services/typescript/generate-type-script.service'

export default class Typescript extends Command {
  static description = 'Scan all files and convert them to typescript like files'

  static examples = [
    `$ ng-mig typescript --project /replace_path/to/your_project`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    project: flags.string({char: 'p', description: 'root project folder containing sources files in the src/ directory.'}),
    rename: flags.boolean({char: 'r', description: 'set to true if you want to rename the file to .ts'}),
    deleteSource: flags.boolean({char: 'd', description: 'set to true if you want to delete originals .js source files'}),
  }

  async run() {
    const { flags } = this.parse(Typescript);

    const project = flags.project || getCurrentDir();
    const rename = flags.rename || false;
    const deleteSource = flags.deleteSource || false;

    if (dirExist(project + "/src")) {
      this.log(`----------------------- Started to convert files in ${project} -------------------`);
      if (rename) {
        this.log(`--rename is set to ${rename}, the files will be renamed to .ts`);
        if (deleteSource) {
          this.log(`--deleteSource is set to ${deleteSource}, the files will be deleted`)
        }
      }
      parseToTypescriptFolder(project, {rename, deleteSource});
    } else {
      this.log(
        `This is not a valid project folder. Make sure you have a directory src/ in this folder. ${project}`
      );
    }
  }
}
