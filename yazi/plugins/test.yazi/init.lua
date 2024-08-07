local function entry(state, args)
	if state.old then
		Manager.render, state.old = state.old, nil
	else
		state.old = Manager.render
		Manager.render = function(self, area)
			self.area = area

			local rc = ui.Rect({
				x = -10, -- x position
				y = -10, -- y position
				w = 10, -- width
				h = 30, -- height
			})

			return ya.flat({
				ui.Clear(rc),
			})

			-- return ui.Layout()
			-- 	:direction(ui.Layout.HORIZONTAL)
			-- 	:constraints({
			-- 		ui.Constraint.Percentage(0),
			-- 		ui.Constraint.Percentage(0),
			-- 		ui.Constraint.Percentage(100),
			-- 	})
			-- 	:split(area)
		end
	end
	ya.app_emit("resize", {})
end

return { entry = entry }
