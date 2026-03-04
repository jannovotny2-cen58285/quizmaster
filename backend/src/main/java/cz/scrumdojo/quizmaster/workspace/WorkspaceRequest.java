package cz.scrumdojo.quizmaster.workspace;

public record WorkspaceRequest(String title) {
    public Workspace toEntity() {
        return Workspace.builder()
            .title(title)
            .build();
    }
}
