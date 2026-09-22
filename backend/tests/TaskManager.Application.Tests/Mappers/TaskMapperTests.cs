using FluentAssertions;
using TaskManager.Application.Dtos;
using TaskManager.Application.Mappers;
using TaskManager.Application.Tests.TestSupport;
using TaskManager.Domain.Tasks;

namespace TaskManager.Application.Tests.Mappers;

public sealed class TaskMapperTests
{
    [Fact]
    public void ToSummary_FlattensTheCatalogsAndKeepsTheRest()
    {
        var id = Guid.NewGuid();
        var task = TaskItemFactory.Create(
            id: id,
            title: "Regar las plantas",
            description: "Las del balcon necesitan agua dos veces por semana.",
            priority: Priority.Low,
            status: Status.Pending);

        var summary = TaskMapper.ToSummary(task);

        summary.Should().Be(new TaskSummaryDto(
            id,
            "Regar las plantas",
            "Las del balcon necesitan agua dos veces por semana.",
            new CatalogItemDto("LOW", "Baja"),
            new CatalogItemDto("PENDING", "Pendiente")));
    }

    [Fact]
    public void ToDetail_CarriesTheDatesThatTheSummaryDoesNotNeed()
    {
        var dueDate = new DateTimeOffset(2026, 12, 24, 20, 0, 0, TimeSpan.Zero);
        var createdAt = new DateTimeOffset(2026, 9, 10, 9, 0, 0, TimeSpan.Zero);

        var detail = TaskMapper.ToDetail(TaskItemFactory.Create(dueDate: dueDate, createdAt: createdAt));

        detail.DueDate.Should().Be(dueDate);
        detail.CreatedAt.Should().Be(createdAt);
    }

    [Fact]
    public void ToDetail_WithoutDueDate_KeepsItNull()
    {
        TaskMapper.ToDetail(TaskItemFactory.Create(dueDate: null)).DueDate.Should().BeNull();
    }

    [Fact]
    public void ToDetail_WithoutDescription_KeepsItNull()
    {
        TaskMapper.ToDetail(TaskItemFactory.Create(description: null)).Description.Should().BeNull();
    }

    [Fact]
    public void ToCatalogItem_FlattensCodeAndName()
    {
        TaskMapper.ToCatalogItem(Priority.High).Should().Be(new CatalogItemDto("HIGH", "Alta"));
        TaskMapper.ToCatalogItem(Status.Completed).Should().Be(new CatalogItemDto("COMPLETED", "Completada"));
    }
}
