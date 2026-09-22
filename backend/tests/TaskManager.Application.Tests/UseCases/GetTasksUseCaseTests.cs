using FluentAssertions;
using Moq;
using TaskManager.Application.Dtos;
using TaskManager.Application.Ports.Out;
using TaskManager.Application.Tests.TestSupport;
using TaskManager.Application.UseCases;
using TaskManager.Domain.Exceptions;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.UseCases;

public sealed class GetTasksUseCaseTests
{
    private readonly Mock<ITaskRepositoryPort> _repository = new(MockBehavior.Strict);
    private readonly GetTasksUseCase _useCase;

    public GetTasksUseCaseTests()
    {
        _useCase = new GetTasksUseCase(_repository.Object);
    }

    private void GivenRepositoryReturns(params TaskItem[] tasks) =>
        _repository
            .Setup(repository => repository.FindAllAsync(It.IsAny<TaskCriteria>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(tasks);

    [Fact]
    public async Task ExecuteAsync_WithoutFilters_QueriesWithoutCriteria()
    {
        GivenRepositoryReturns();

        await _useCase.ExecuteAsync(TaskFilter.Empty, CancellationToken.None);

        _repository.Verify(
            repository => repository.FindAllAsync(TaskCriteria.None, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithStatusOnly_QueriesWithStatusCriteria()
    {
        GivenRepositoryReturns();

        await _useCase.ExecuteAsync(new TaskFilter("PENDING", null), CancellationToken.None);

        _repository.Verify(
            repository => repository.FindAllAsync(
                new TaskCriteria(Status.Pending, null),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithPriorityOnly_QueriesWithPriorityCriteria()
    {
        GivenRepositoryReturns();

        await _useCase.ExecuteAsync(new TaskFilter(null, "HIGH"), CancellationToken.None);

        _repository.Verify(
            repository => repository.FindAllAsync(
                new TaskCriteria(null, Priority.High),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithBothFilters_QueriesWithBothCriteria()
    {
        GivenRepositoryReturns();

        await _useCase.ExecuteAsync(new TaskFilter("completed", "low"), CancellationToken.None);

        _repository.Verify(
            repository => repository.FindAllAsync(
                new TaskCriteria(Status.Completed, Priority.Low),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task ExecuteAsync_WithBlankFilters_TreatsThemAsAbsent(string blank)
    {
        GivenRepositoryReturns();

        await _useCase.ExecuteAsync(new TaskFilter(blank, blank), CancellationToken.None);

        _repository.Verify(
            repository => repository.FindAllAsync(TaskCriteria.None, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithUnknownStatus_ThrowsAndNeverReachesTheRepository()
    {
        var act = () => _useCase.ExecuteAsync(new TaskFilter("URGENTE", null), CancellationToken.None);

        var exception = await act.Should().ThrowAsync<InvalidFilterException>();
        exception.Which.FilterName.Should().Be("status");
        exception.Which.InvalidValue.Should().Be("URGENTE");
        exception.Which.AllowedValues.Should().BeEquivalentTo(["PENDING", "IN_PROGRESS", "COMPLETED"]);

        _repository.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ExecuteAsync_WithUnknownPriority_ThrowsAndNeverReachesTheRepository()
    {
        var act = () => _useCase.ExecuteAsync(new TaskFilter(null, "URGENTE"), CancellationToken.None);

        var exception = await act.Should().ThrowAsync<InvalidFilterException>();
        exception.Which.FilterName.Should().Be("priority");
        exception.Which.AllowedValues.Should().BeEquivalentTo(["HIGH", "MEDIUM", "LOW"]);

        _repository.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ExecuteAsync_WithoutMatches_ReturnsAnEmptyList()
    {
        GivenRepositoryReturns();

        var result = await _useCase.ExecuteAsync(TaskFilter.Empty, CancellationToken.None);

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task ExecuteAsync_MapsEachTaskToItsSummary()
    {
        var id = Guid.NewGuid();
        GivenRepositoryReturns(TaskItemFactory.Create(
            id: id,
            title: "Renovar el pasaporte",
            description: null,
            priority: Priority.High,
            status: Status.InProgress));

        var result = await _useCase.ExecuteAsync(TaskFilter.Empty, CancellationToken.None);

        result.Should().ContainSingle();
        result[0].Should().BeEquivalentTo(new TaskSummaryDto(
            id,
            "Renovar el pasaporte",
            null,
            new CatalogItemDto("HIGH", "Alta"),
            new CatalogItemDto("IN_PROGRESS", "En progreso")));
    }

    [Fact]
    public async Task ExecuteAsync_PropagatesTheCancellationToken()
    {
        using var cancellation = new CancellationTokenSource();
        GivenRepositoryReturns();

        await _useCase.ExecuteAsync(TaskFilter.Empty, cancellation.Token);

        _repository.Verify(
            repository => repository.FindAllAsync(It.IsAny<TaskCriteria>(), cancellation.Token),
            Times.Once);
    }
}
