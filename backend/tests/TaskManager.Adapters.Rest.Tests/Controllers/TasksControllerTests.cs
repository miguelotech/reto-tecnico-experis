using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using TaskManager.Adapters.Rest.Controllers;
using TaskManager.Application.Dtos;
using TaskManager.Application.Ports.In;
using TaskManager.Domain.Exceptions;

namespace TaskManager.Adapters.Rest.Tests.Controllers;

public sealed class TasksControllerTests
{
    private readonly Mock<IGetTasksUseCase> _getTasks = new(MockBehavior.Strict);
    private readonly Mock<IGetTaskByIdUseCase> _getTaskById = new(MockBehavior.Strict);
    private readonly TasksController _controller;

    public TasksControllerTests()
    {
        _controller = new TasksController(_getTasks.Object, _getTaskById.Object);
    }

    private static TaskSummaryDto Summary(string title) => new(
        Guid.NewGuid(),
        title,
        null,
        new CatalogItemDto("HIGH", "Alta"),
        new CatalogItemDto("PENDING", "Pendiente"));

    [Fact]
    public async Task GetTasks_ReturnsTheListWith200()
    {
        _getTasks
            .Setup(useCase => useCase.ExecuteAsync(It.IsAny<TaskFilter>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync([Summary("Renovar el pasaporte"), Summary("Regar las plantas")]);

        var result = await _controller.GetTasks(null, null, CancellationToken.None);

        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Value.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetTasks_HandsTheQueryStringToTheUseCaseUntouched()
    {
        _getTasks
            .Setup(useCase => useCase.ExecuteAsync(It.IsAny<TaskFilter>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        await _controller.GetTasks("pending", "HIGH", CancellationToken.None);

        _getTasks.Verify(
            useCase => useCase.ExecuteAsync(new TaskFilter("pending", "HIGH"), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetTasks_WithoutResults_ReturnsAnEmptyListAndNot404()
    {
        _getTasks
            .Setup(useCase => useCase.ExecuteAsync(It.IsAny<TaskFilter>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        var result = await _controller.GetTasks("COMPLETED", "HIGH", CancellationToken.None);

        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Value.Should().BeEmpty();
    }

    [Fact]
    public async Task GetTaskById_WithAValidId_ReturnsTheDetailWith200()
    {
        var id = Guid.NewGuid();
        var detail = new TaskDetailDto(
            id,
            "Renovar el pasaporte",
            "Llevar el DNI vigente.",
            new CatalogItemDto("HIGH", "Alta"),
            new CatalogItemDto("PENDING", "Pendiente"),
            null,
            DateTimeOffset.UtcNow);
        _getTaskById
            .Setup(useCase => useCase.ExecuteAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(detail);

        var result = await _controller.GetTaskById(id.ToString(), CancellationToken.None);

        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Value.Should().Be(detail);
    }

    [Theory]
    [InlineData("abc")]
    [InlineData("123")]
    [InlineData("aaaaaaaa-0000-4000-8000")]
    public async Task GetTaskById_WithAMalformedId_ThrowsBeforeReachingTheUseCase(string id)
    {
        var act = () => _controller.GetTaskById(id, CancellationToken.None);

        var exception = await act.Should().ThrowAsync<InvalidTaskIdException>();
        exception.Which.InvalidValue.Should().Be(id);

        _getTaskById.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task GetTaskById_LetsTheNotFoundExceptionBubbleUpToTheMiddleware()
    {
        var id = Guid.NewGuid();
        _getTaskById
            .Setup(useCase => useCase.ExecuteAsync(id, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new TaskNotFoundException(id));

        var act = () => _controller.GetTaskById(id.ToString(), CancellationToken.None);

        await act.Should().ThrowAsync<TaskNotFoundException>();
    }

    [Fact]
    public async Task GetTasks_PropagatesTheCancellationToken()
    {
        using var cancellation = new CancellationTokenSource();
        _getTasks
            .Setup(useCase => useCase.ExecuteAsync(It.IsAny<TaskFilter>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        await _controller.GetTasks(null, null, cancellation.Token);

        _getTasks.Verify(
            useCase => useCase.ExecuteAsync(It.IsAny<TaskFilter>(), cancellation.Token),
            Times.Once);
    }
}
