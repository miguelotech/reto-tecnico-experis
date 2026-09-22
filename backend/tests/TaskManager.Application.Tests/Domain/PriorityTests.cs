using FluentAssertions;
using TaskManager.Domain.Exceptions;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.Domain;

public sealed class PriorityTests
{
    [Theory]
    [InlineData("HIGH")]
    [InlineData("high")]
    [InlineData("  High  ")]
    public void TryParse_WithKnownCode_ReturnsTheValue(string code)
    {
        var parsed = Priority.TryParse(code, out var priority);

        parsed.Should().BeTrue();
        priority.Should().Be(Priority.High);
        priority!.Name.Should().Be("Alta");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("URGENTE")]
    [InlineData("HIGHEST")]
    public void TryParse_WithUnknownCode_ReturnsFalse(string? code)
    {
        var parsed = Priority.TryParse(code, out var priority);

        parsed.Should().BeFalse();
        priority.Should().BeNull();
    }

    [Fact]
    public void FromCode_WithUnknownCode_Throws()
    {
        var act = () => Priority.FromCode("URGENTE");

        act.Should().Throw<UnknownCatalogCodeException>()
            .Which.Code.Should().Be("URGENTE");
    }

    [Fact]
    public void Codes_ExposesTheWholeCatalog()
    {
        Priority.Codes.Should().BeEquivalentTo(["HIGH", "MEDIUM", "LOW"]);
    }

    [Fact]
    public void All_IsOrderedFromHighestToLowest()
    {
        Priority.All.Should().ContainInOrder(Priority.High, Priority.Medium, Priority.Low);
    }
}
