<?php
// Include js/script.js and js/handlebars.js
// script('memopad', 'script');
// script('memopad', 'handlebars');
script('memopad', 'app');

// Include css/style.css
style('memopad', 'style');
?>

<div id="app">
	<div id="app-navigation">
		<?php print_unescaped($this->inc('navigation/index')); ?>
		<?php print_unescaped($this->inc('settings/index')); ?>
	</div>

	<div id="app-content">
		<div id="app-content-wrapper">
			<?php print_unescaped($this->inc('content/index')); ?>
		</div>
	</div>
</div>
