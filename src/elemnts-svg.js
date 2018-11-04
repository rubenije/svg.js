    // Import raw svg
    svg: function (svg, fn = false) {
      var well, len

      // act as getter if no svg string is given
      if(svg == null || svg === true || typeof svg == 'function') {
        // write svgjs data to the dom
        this.writeDataToDom()
        let current = this

        // An export modifier was passed
        if (typeof svg == 'function') {
          // Juggle arguments
          [fn, svg] = [svg, fn]

          // If the user wants outerHTML we need to process this node, too
          if (!svg) {
            current = fn(current)

            // The user does not want this node? Well, then he gets nothing
            if (current === false) return ''
          }

          // Deep loop through all children and apply modifier
          current.each(function () {
            let result = fn(this)

            // If modifier returns false, discard node
            if (result === false) {
              this.remove()

            // If modifier returns new node, use it
            } else if (result !== this) {
              this.replace(result)
            }
          }, true)
        }

        // Return outer or inner content
        return svg
          ? current.node.innerHTML
          : current.node.outerHTML
      }

      // Act as setter if we got a string

      // Make sure we are on a current when trying to import
      if(!(this instanceof SVG.Parent))
        throw Error('Cannot import svg into non-current element')

      // Create temporary holder
      well = document.createElementNS(SVG.ns, 'svg')
      fragment = document.createDocumentFragment()

      // Dump raw svg
      well.innerHTML = svg

      // Transplant nodes into the fragment
      for (len = well.children.length; len--;) {
        fragment.appendChild(well.firstElementChild)
      }

      // Add the whole fragment at once
      this.node.appendChild(fragment)

      return this
    },
