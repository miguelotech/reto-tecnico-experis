using FluentAssertions;
using Moq;
using TaskManager.Application.Dtos;
using TaskManager.Application.Ports.Out;
using TaskManager.Application.UseCases;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.UseCases;

public sealed class GetCatalogsUseCaseTests
{
    private readonly Mock<ICatalogRepositoryPort> _repository = new(MockBehavior.Strict);
    private readonly GetCatalogsUseCase _useCase;

    public GetCatalogsUseCaseTests()
    {
        _useCase = new GetCatalogsUseCase(_repository.Object);
    }

    [Fact]
    public async Task GetPrioritiesAsync_KeepsTheOrderGivenByTheRepository()
    {
        _repository
            .Setup(repository => repository.FindPrioritiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([Priority.High, Priority.Medium, Priority.Low]);

        var result = await _useCase.GetPrioritiesAsync(CancellationToken.None);

        result.Should().Equal(
            new CatalogItemDto("HIGH", "Alta"),
            new CatalogItemDto("MEDIUM", "Media"),
            new CatalogItemDto("LOW", "Baja"));
    }

    [Fact]
    public async Task GetStatusesAsync_KeepsTheOrderGivenByTheRepository()
    {
        _repository
            .Setup(repository => repository.FindStatusesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([Status.Pending, Status.InProgress, Status.Completed]);

        var result = await _useCase.GetStatusesAsync(CancellationToken.None);

        result.Should().Equal(
            new CatalogItemDto("PENDING", "Pendiente"),
            new CatalogItemDto("IN_PROGRESS", "En progreso"),
            new CatalogItemDto("COMPLETED", "Completada"));
    }
}
