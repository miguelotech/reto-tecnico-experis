using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using TaskManager.Adapters.Rest.Controllers;
using TaskManager.Application.Dtos;
using TaskManager.Application.Ports.In;

namespace TaskManager.Adapters.Rest.Tests.Controllers;

public sealed class CatalogsControllerTests
{
    private readonly Mock<IGetCatalogsUseCase> _getCatalogs = new(MockBehavior.Strict);
    private readonly CatalogsController _controller;

    public CatalogsControllerTests()
    {
        _controller = new CatalogsController(_getCatalogs.Object);
    }

    [Fact]
    public async Task GetPriorities_ReturnsTheCatalogWith200()
    {
        _getCatalogs
            .Setup(useCase => useCase.GetPrioritiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([new CatalogItemDto("HIGH", "Alta"), new CatalogItemDto("LOW", "Baja")]);

        var result = await _controller.GetPriorities(CancellationToken.None);

        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Value.Should().Equal(new CatalogItemDto("HIGH", "Alta"), new CatalogItemDto("LOW", "Baja"));
    }

    [Fact]
    public async Task GetStatuses_ReturnsTheCatalogWith200()
    {
        _getCatalogs
            .Setup(useCase => useCase.GetStatusesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([new CatalogItemDto("PENDING", "Pendiente")]);

        var result = await _controller.GetStatuses(CancellationToken.None);

        result.StatusCode.Should().Be(StatusCodes.Status200OK);
        result.Value.Should().ContainSingle();
    }
}
