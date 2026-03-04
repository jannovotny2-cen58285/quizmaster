package cz.scrumdojo.quizmaster.workspace;

public record WorkspaceResponse(String guid, String title) {
    public static WorkspaceResponse from(Workspace workspace) {
        return new WorkspaceResponse(workspace.getGuid(), workspace.getTitle());
    }
}
