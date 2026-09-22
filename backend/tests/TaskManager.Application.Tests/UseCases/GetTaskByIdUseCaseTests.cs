using FluentAssertions;
using Moq;
using TaskManager.Application.Ports.Out;
using TaskManager.Application.Tests.TestSupport;
using TaskManager.Application.UseCases;
using TaskManager.Domain.Exceptions;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.UseCases;

public sealed class GetTaskByIdUseCaseTests
{
    private readonly Mock<ITaskRepositoryPort> _repository = new(MockBehavior.Strict);
    private readonly GetTaskByIdUseCase _useCase;

    public GetTaskByIdUseCaseTests()
    {
        _useCase = new GetTaskByIdUseCase(_repository.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WhenTheTaskExists_ReturnsItsDetail()
    {
        var id = Guid.NewGuid();
        var dueDate = new DateTimeOffset(2026, 10, 5, 12, 0, 0, TimeSpan.Zero);
        var createdAt = new DateTimeOffset(2026, 9, 1, 8, 30, 0, TimeSpan.Zero);
        _repository
            .Setup(repository => repository.FindByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(TaskItemFactory.Create(
                id: id,
                title: "Comparar planes de internet",
                description: "Revisar velocidad de subida.",
                priority: Priority.Low,
                status: Status.Completed,
                dueDate: dueDate,
                createdAt: createdAt));

        var result = await _useCase.ExecuteAsync(id, CancellationToken.None);

        result.Id.Should().Be(id);
        result.Title.Should().Be("Comparar planes de internet");
        result.Description.Should().Be("Revisar velocidad de subida.");
        result.Priority.Code.Should().Be("LOW");
        result.Status.Name.Should().Be("Completada");
        result.DueDate.Should().Be(dueDate);
        result.CreatedAt.Should().Be(createdAt);
    }

    [Fact]
    public async Task ExecuteAsync_WhenTheTaskDoesNotExist_Throws()
    {
        var id = Guid.NewGuid();
        _repository
            .Setup(repository => repository.FindByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskItem?)null);

        var act = () => _useCase.ExecuteAsync(id, CancellationToken.None);

        var exception = await act.Should().ThrowAsync<TaskNotFoundException>();
        exception.Which.TaskId.Should().Be(id);
    }
}
