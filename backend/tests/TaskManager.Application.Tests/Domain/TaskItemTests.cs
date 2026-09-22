using FluentAssertions;
using TaskManager.Application.Tests.TestSupport;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.Domain;

public sealed class TaskItemTests
{
    [Fact]
    public void Constructor_WithEmptyId_Throws()
    {
        var act = () => TaskItemFactory.Create(id: Guid.Empty);

        act.Should().Throw<ArgumentException>().WithParameterName("id");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_WithBlankTitle_Throws(string title)
    {
        var act = () => TaskItemFactory.Create(title: title);

        act.Should().Throw<ArgumentException>().WithParameterName("title");
    }

    [Fact]
    public void Constructor_TrimsTheTitle()
    {
        var task = TaskItemFactory.Create(title: "  Regar las plantas  ");

        task.Title.Should().Be("Regar las plantas");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_NormalizesBlankDescriptionToNull(string? description)
    {
        var task = TaskItemFactory.Create(description: description);

        task.Description.Should().BeNull();
    }

    [Fact]
    public void Constructor_WithoutPriority_Throws()
    {
        var act = () => new TaskItem(Guid.NewGuid(), "Titulo", null, null!, Status.Pending, null, DateTimeOffset.UtcNow);

        act.Should().Throw<ArgumentNullException>();
    }
}
