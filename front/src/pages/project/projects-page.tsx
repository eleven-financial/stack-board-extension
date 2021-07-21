import React from 'react';
import './projects-page.scss';

import {
  CustomHeader,
  HeaderDescription,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import TemplatePanel from '../../components/template/template-panel';

import {
  Table,
} from "azure-devops-ui/Table";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { Services } from '../../services/services';
import { ITemplateService, TemplateServiceId, } from '../../services/template';
import { ITemplate } from '../../model/template';
import { IProjectService, ProjectServiceId } from '../../services/project';
import { IProject } from '../../model/project';

import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import ProjectPanel from '../../components/project/project-panel';
import { columns, projectsMock } from './projects-page-settings';


interface IProjectsState {
  templateExpanded: boolean;
  projectExpanded: boolean;
  template: ITemplate[];
  projects: IProject[];
}

class ProjectsPage extends React.Component<{}, IProjectsState>  {

  templateService = Services.getService<ITemplateService>(TemplateServiceId);
  projectService = Services.getService<IProjectService>(ProjectServiceId);

  constructor(props: {}) {
    super(props);

    this.state = {
      templateExpanded: false,
      projectExpanded: false,
      template: [],
      projects: []
    };

    this.loadTemplate();
    this.loadProjects();
  }

  loadTemplate() {
    this.templateService.getTemplate().then(items => {
      this.setState({ template: items });
    });
  }
  loadProjects() {
    this.projectService.getProject().then(items => {
      this.setState({ projects: items });
    });
  }

  render() {

    const { projects } = this.state;

    return (
      <Page className="flex-grow">
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                Projects
              </HeaderTitle>
            </HeaderTitleRow>
            <HeaderDescription>
              Projects list generated from templates
            </HeaderDescription>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button text="Create" iconProps={{ iconName: "Add" }} primary={true}
              onClick={() => this.setState({ projectExpanded: true })}
            />
            <Button ariaLabel="Settings" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ templateExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">
          {projects.length == 0 && <ZeroData
            primaryText="Get started your first project"
            secondaryText={
              <span>
                Save time by creating a new project from templates.
              </span>
            }
            imageAltText="Bars"
            imagePath={"https://cdn.vsassets.io/ext/ms.vss-code-web/import-content/repoNotFound.bVoHtlP2mhhyPo5t.svg"}
            actionText="Create"
            actionType={ZeroDataActionType.ctaButton}
            onActionClick={(event, item) =>
              this.setState({ projectExpanded: true })
            } />
          }

          {projects.length > 0 && <Card
            className="flex-grow bolt-table-card"
            contentProps={{ contentPadding: false }}
            titleProps={{ text: "All projects" }}
          >
            <Observer itemProvider={new ObservableValue<ArrayItemProvider<IProject>>(
              new ArrayItemProvider(this.state.projects)
            )}>
              {(observableProps: { itemProvider: ArrayItemProvider<IProject> }) => (
                <Table
                  ariaLabel="Projects table"
                  columns={columns}
                  itemProvider={observableProps.itemProvider}
                  showLines={true}
                  onSelect={(event, data) => console.log("Selected Row - " + data.index)}
                  onActivate={(event, row) => console.log("Activated Row - " + row.index)}
                />
              )}
            </Observer>
          </Card>}

        </div>

        <TemplatePanel show={this.state.templateExpanded} onDismiss={() => { this.setState({ templateExpanded: false }); this.loadTemplate() }} />
        <ProjectPanel template={this.state.template} show={this.state.projectExpanded} onDismiss={() => { this.setState({ projectExpanded: false }); this.loadTemplate() }} />

      </Page>
    );
  }
  
}

export default ProjectsPage;
