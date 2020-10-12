$(document).on("turbolinks:load", function () {
    if ($(".static_pages.index").length > 0) {
        var tasks = [];
        var filter;

        indexTasks(function (response) {
            tasks = response.tasks
            createList(tasks);

            createEventListeners();
        });

        var addTaskToDom = function (task) {
            $("#tasks").append("<div class='task' data-id='" + task.id + "' data-complete='" + task.completed + "'>\
                                    <div class='task-fg'>\
                                        <i class='completed far " + (task.completed ? "fa-check-square" : "fa-square") + "'></i>\
                                        <div class='d-inline-block'>" + task.content + "</div>\
                                    </div>\
                                    <div class='task-bg'>\
                                        <i class='remove fa fa-times'></i>\
                                    </div>\
                                </div>");
        };

        var createList = function (tasks) {
            if (tasks.length === 0) {
                $("#tasks").append("<div class='text-center'>No Tasks Available</div>")
            }
            tasks.forEach(task => {
                addTaskToDom(task);
            })
        };

        var changeCategory = function () {
            filter = $(this).data("filter");
            filterData(filter);
        };

        var filterData = function (filter) {
            $("#tasks").text("");
            var filteredTasks = [];

            switch (filter) {
                case 0: filteredTasks = tasks.filter(x => x.completed === false);
                    break;
                case 1: filteredTasks = tasks.filter(x => x.completed === true);
                    break;
                default: filteredTasks = tasks;
            }

            createList(filteredTasks);
        }

        var toggleComplete = function () {
            var completeIcon = $(this).children(".completed").first();
            var item = $(this).closest(".task");
            var isComplete = item.data("complete") ? false : true;

            item.addClass("disabled");
            completeIcon.removeClass(["far", "fa-square", "fa-check-square"]);
            completeIcon.addClass(["fa", "fa-spin", "fa-spinner"]);
            updateTask(item.data("id"), isComplete, function (response) {
                tasks.splice(tasks.map(x => x.id).indexOf(response.task.id), 1, response.task);
                filterData(filter);
            });
        }

        var addTodoItem = function (event) {
            event.preventDefault();
            postTask($(this).find("[name=taskName]").val(),
                function (response) {
                    console.log(response);
                    tasks.push(response.task);
                    filterData(filter);
                });

            $(this).find("[name=taskName]").val("");
        };

        var createEventListeners = function () {
            $(document).on("click", ".task-fg", toggleComplete);

            $(document).on("click", ".task-bg", function () {
                let item = $(this).closest(".task");
                let id = item.data("id")
                item.addClass("disabled");

                deleteTask(id, function () {
                    tasks.splice(tasks.map(x => x.id).indexOf(id), 1);
                    filterData(filter);
                });
            });

            $(document).on("submit", "#todoForm", addTodoItem);

            filter = $("#filter");

            for (var child of filter.children()) {
                $($(child).children()[0]).on("change", changeCategory);
            }
        };
    }
});