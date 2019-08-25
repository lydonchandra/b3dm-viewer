chrome.devtools.panels.create("B3DM Viewer",
    "MyPanelIcon.png",
    "Panel.html",
    function(panel) {

        chrome.devtools.panels.elements.createSidebarPane("My Sidebar",
            function(sidebar) {
                // sidebar initialization code here
                sidebar.setObject({ some_data: "Some data to show" });
            });

    }
);

