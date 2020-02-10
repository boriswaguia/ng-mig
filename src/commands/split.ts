import { Command, flags } from "@oclif/command";
import { getCurrentDir, dirExist } from "../vendors/helpers/directory.helper";
import { getSourceFiles } from "../vendors/helpers/dirwalk.helper";
import { processFiles } from "../services/process-file.service";

export default class Split extends Command {
  static description =
    "Search for all angularjs files, containing an angular.module declaration and extract functions to separated fifles";

  static examples = [`$ ng-mig split $project_dir`];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-p, --project=VALUE)
    project: flags.string({
      char: "p",
      description: "path of the project to scan"
    })
  };

  // static args = [{name: 'file'}]

  async run() {
    const { args, flags } = this.parse(Split);

    const project = flags.project || getCurrentDir();

    if (dirExist(project + "/src")) {
      this.log(
        "----------------------- Started extracting -------------------"
      );
      const sources = getSourceFiles(project);
      processFiles(sources);
      this.log(
        "----------------------- Finished extracting -------------------"
      );
    } else {
      this.log(
        "This is not a valid project folder. Make sure you have a directir src/ in this folder."
      );
    }
  }
}
