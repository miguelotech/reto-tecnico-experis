using FluentAssertions;
using TaskManager.Domain.Exceptions;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.Domain;

public sealed class StatusTests
{
    [Theory]
    [InlineData("IN_PROGRESS")]
    [InlineData("in_progress")]
    [InlineData("  In_Progress  ")]
    public void TryParse_WithKnownCode_ReturnsTheValue(string code)
    {
        var parsed = Status.TryParse(code, out var status);

        parsed.Should().BeTrue();
        status.Should().Be(Status.InProgress);
        status!.Name.Should().Be("En progreso");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("DONE")]
    [InlineData("IN PROGRESS")]
    public void TryParse_WithUnknownCode_ReturnsFalse(string? code)
    {
        var parsed = Status.TryParse(code, out var status);

        parsed.Should().BeFalse();
        status.Should().BeNull();
    }

    [Fact]
    public void FromCode_WithUnknownCode_Throws()
    {
        var act = () => Status.FromCode("DONE");

        act.Should().Throw<UnknownCatalogCodeException>()
            .Which.CatalogName.Should().Be("Status");
    }

    [Fact]
    public void Codes_ExposesTheWholeCatalog()
    {
        Status.Codes.Should().BeEquivalentTo(["PENDING", "IN_PROGRESS", "COMPLETED"]);
    }
}
